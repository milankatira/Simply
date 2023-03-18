package com.X.X.services;
import com.X.X.token.TokenServices;
import com.X.X.dto.LoginDTO;
import com.X.X.dto.LoginResponse;
import com.X.X.dto.RegisterDTO;
import com.X.X.dto.RegisterResponse;
import com.X.X.domains.User;
import com.X.X.help.Status;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.X.X.repositories.UserRepository;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;


@Service
public record UserService(UserRepository userRepo,
                          PasswordEncoder passwordEncoder,
                          TokenServices tokenServices) {

    public LoginResponse login(LoginDTO loginDTO) {
        User user = userRepo.findByEmail(loginDTO.getEmail());
        if (passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            String token = tokenServices.generateTokenUser(user, loginDTO.isRememberMe());
            UUID accountId = user.getAccountId();
            return new LoginResponse(token, Status.OK, accountId);
        } else {
            return new LoginResponse("", Status.FAILED, null);
        }

    }

    public RegisterResponse register(RegisterDTO registerDTO) {
        // Check if a user with the same username already exists
        if (userRepo.findByUsername(registerDTO.getUsername()) != null || userRepo.findByEmail(registerDTO.getEmail()) != null) {
            return new RegisterResponse(Status.FAILED);
        }

        // Register the new user
        User newUser = User.builder()
                .userId(UUID.randomUUID())
                .accountId(UUID.randomUUID())
                .username(registerDTO.getUsername())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .firstName(registerDTO.getFirstName())
                .lastName(registerDTO.getLastName())
                .role(registerDTO.getRole())
                .build();
        try {
            userRepo.save(newUser);
            return new RegisterResponse(Status.OK);
        } catch (Exception e) {
            System.out.println(e);
            return new RegisterResponse(Status.FAILED);
        }
    }

    public UUID getLoggedInUserAccountId(String token) {
        if (!tokenServices.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired authorization token");
        }
        String email = tokenServices.getMail(token);
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user");
        }
        return user.getAccountId();
    }

    public void blacklistToken(String token) {
        tokenServices.blacklistToken(token);
    }

}