package com.sliit.smartcampus.modules.user.model;

import com.sliit.smartcampus.common.enums.Role;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data // This Lombok annotation automatically generates getters, setters, and constructors
@Document(collection = "users") // Tells Spring to save this in the 'users' MongoDB collection
public class User {
    
    @Id
    private String id;
    
    private String email;
    private String name;
    private String pictureUrl; // Let's grab their Google profile picture too for a nice UI later!
    
    private Role role;
}