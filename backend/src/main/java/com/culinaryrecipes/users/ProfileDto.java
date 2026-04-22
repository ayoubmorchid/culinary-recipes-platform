package com.culinaryrecipes.users;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileDto {

    private String username;
    private String bio;
    private String avatar;
}