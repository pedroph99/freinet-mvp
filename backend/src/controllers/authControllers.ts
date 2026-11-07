import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/token";
import {
  getUserByEmail,
  getUserById,
  updateLastLogin,
  getUserByCpf,
} from "../models/userModels";
import { createTeacher } from "../models/teacherModels";
// Login
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    await updateLastLogin(user.id);

    const token = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.person.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to login: ${(error as Error).message}` });
    console.log(error);
  }
}

export async function registerTeacher(req: Request, res: Response) {
  try {
    const { name, email, password, phone, specialization, cpf, birthDate } =
      req.body;

    if (!name || !email || !password || !cpf || !phone || !specialization) {
      return res
        .status(400)
        .json({
          error:
            "Missing required fields: name, email, password, cpf, phone, specialization ",
        });
    }

    if (await getUserByEmail(email)) {
      return res.status(409).json({ error: "Email already in use" });
    }

    if (await getUserByCpf(cpf)) {
      return res.status(409).json({ error: "CPF already in use" });
    }

    const teacher = await createTeacher({
      name,
      email,
      phone: phone || null,
      password: password,
      specialization: specialization || null,
      cpf: cpf || null,
      birthDate: birthDate || null,
      photoUrl: null,
      hireDate: new Date(),
    });

    res.status(201).json({
      message: "Teacher registered successfully",
      teacher: {
        id: teacher?.person.user?.id,
        name: teacher?.person.name,
        email: teacher?.person.email,
        role: teacher?.person.user?.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: `Failed to register teacher: ${(error as Error).message}`,
      });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      person: {
        name: user.person.name,
        email: user.person.email,
        phone: user.person.phone,
      },
      profile: user.person.studentProfile || user.person.teacherProfile,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
}
