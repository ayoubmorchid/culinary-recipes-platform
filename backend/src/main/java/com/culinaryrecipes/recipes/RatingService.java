package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;

    public List<RatingDto> getRatings() {
        return ratingRepository.findAll()
                .stream()
                .map(rating -> RatingDto.builder()
                        .value(rating.getValue())
                        .username(
                                rating.getUser() != null
                                        ? rating.getUser().getUsername()
                                        : null
                        )
                        .build())
                .toList();
    }
}