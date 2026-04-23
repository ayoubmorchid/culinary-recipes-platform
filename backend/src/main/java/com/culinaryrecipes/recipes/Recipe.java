package com.culinaryrecipes.recipes;

import com.culinaryrecipes.users.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(unique = true)
    private String slug;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;
}