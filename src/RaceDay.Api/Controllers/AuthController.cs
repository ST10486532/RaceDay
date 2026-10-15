using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RaceDay.Api.Data;
using RaceDay.Api.Dtos;
using RaceDay.Api.Models;

namespace RaceDay.Api.Controllers;

/// <summary>Registration, login and logout. Login starts a cookie-based session that carries the user's role.</summary>
[ApiController]
[Route("api/auth")]
public class AuthController : ApiControllerBase
{
    private readonly RaceDayContext _db;
    private readonly IConfiguration _config;

    // We removed IPasswordHasher from the constructor to fix the hang
    public AuthController(RaceDayContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    /// <summary>Register a new account as an Organiser or a Participant.</summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<UserResponse>> Register(RegisterRequest req)
    {
        var role = RoleNames.All.FirstOrDefault(r => string.Equals(r, req.Role?.Trim(), StringComparison.OrdinalIgnoreCase));
        if (role == null)
            return Fail(StatusCodes.Status400BadRequest, "Invalid role", "Role must be either 'Organiser' or 'Participant'.");

        if (role == RoleNames.Organiser)
        {
            var expected = _config["Registration:OrganiserCode"];
            if (string.IsNullOrWhiteSpace(expected) || req.OrganiserCode != expected)
                return Fail(StatusCodes.Status403Forbidden, "Invalid organiser code",
                    "Registering as an Organiser requires a valid organiser invite code.");
        }

        var email = req.Email.Trim().ToLowerInvariant();
        if (await _db.Users.AnyAsync(u => u.Email == email))
            return Fail(StatusCodes.Status409Conflict, "Email already registered", "An account with this email already exists.");

        var user = new AppUser
        {
            FullName = req.FullName.Trim(),
            Email = email,
            Role = role
        };

        // FIXED: Use our reliable HashPassword method instead of the hanging _hasher
        user.PasswordHash = HashPassword(req.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Created("/api/users/me", UserResponse.From(user));
    }

    /// <summary>Log in with email and password and start a session.</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

        // FIXED: Compare the hashes directly
        if (user == null || user.PasswordHash != HashPassword(req.Password))
        {
            return Fail(StatusCodes.Status401Unauthorized, "Invalid credentials", "Email or password is incorrect.");
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.UserID.ToString()),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role)
        };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity),
            new AuthenticationProperties { IsPersistent = false });

        return Ok(new LoginResponse(user.UserID, user.FullName, user.Role, "Logged in."));
    }

    /// <summary>Log out and end the current session.</summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(MessageResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<MessageResponse>> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new MessageResponse("Logged out."));
    }

    // Helper method for simple, reliable password hashing
    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}