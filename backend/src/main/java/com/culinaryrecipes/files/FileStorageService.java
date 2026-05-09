package com.culinaryrecipes.files;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.avatars-dir}")
    private String avatarsDir;

    @Value("${app.upload.recipes-dir}")
    private String recipesDir;

    public String storeAvatar(MultipartFile file) {
        return storeFile(file, avatarsDir, "avatars");
    }

    public String storeRecipeImage(MultipartFile file) {
        return storeFile(file, recipesDir, "recipes");
    }

    private String storeFile(MultipartFile file, String dir, String urlPath) {
        try {
            Path uploadPath = Paths.get(dir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName != null ? originalFileName.substring(originalFileName.lastIndexOf(".")) : ".jpg";
            String fileName = UUID.randomUUID() + extension;
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + urlPath + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors du stockage du fichier.", e);
        }
    }
}
