"use server";

import { createSession, deleteSession } from "../../lib/session";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";
import { comparePasswords } from "../../lib/auth";

export async function login(prevState, formData) {
  // Convert FormData to object
  const formValues = Object.fromEntries(formData);
  const { email, password } = formValues;

  // Basic validation
  const errors = {};
  
  if (!email || !email.includes('@')) {
    errors.email = ["Invalid email address"];
  }
  
  if (!password || password.length < 8) {
    errors.password = ["Password must be at least 8 characters"];
  }
  
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Check if user exists and password is correct
    if (!user || !(await comparePasswords(password, user.password))) {
      return {
        errors: {
          email: ["Invalid email or password"]
        }
      };
    }

    // Create session with JWT
    await createSession(user.id);

    // Redirect to dashboard
    redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return {
      errors: {
        _form: ["An error occurred during login"]
      }
    };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}