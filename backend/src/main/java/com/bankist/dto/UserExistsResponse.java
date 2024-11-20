package com.bankist.dto;

public class UserExistsResponse {
    private final boolean usernameExists;
    private final boolean emailExists;
    private final String usernameError;
    private final String emailError;

    public UserExistsResponse(boolean usernameExists, boolean emailExists, 
                            String usernameError, String emailError) {
        this.usernameExists = usernameExists;
        this.emailExists = emailExists;
        this.usernameError = usernameError;
        this.emailError = emailError;
    }

    public boolean isUsernameExists() {
        return usernameExists;
    }

    public boolean isEmailExists() {
        return emailExists;
    }

    public String getUsernameError() {
        return usernameError;
    }

    public String getEmailError() {
        return emailError;
    }
}