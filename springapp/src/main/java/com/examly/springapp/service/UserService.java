package com.examly.springapp.service;

import java.util.List;

import com.examly.springapp.model.User;

public interface UserService {

    User getUserById(Long id);

    List<User> getAllUsers();

    User updateUser(Long id, User user);

    void deleteUser(Long id);
}