package com.culinaryrecipes.users;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileDto {

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String bio;
    private String avatar;
}