package com.culinaryrecipes.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    private final Path uploadPath = Paths.get("uploads");

    public String saveFile(MultipartFile file) {

        try {

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(file.getOriginalFilename());

            Files.copy(file.getInputStream(), filePath);

            return filePath.toString();

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file");
        }
    }
}