"use client";

import React, { createContext, useState, ReactNode } from "react";

export type UserRole = "Admin" | "Doctor" | "PharmaAdmin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  username: string;
  dateOfJoining: string;
  profilePic: string;
  hospital?: string;
  department?: string;
  specialization?: string;
  scheduleLink?: string;
  inventoryZone?: string;
  shift?: string;
}

const USERS: Record<UserRole, User> = {
  Admin: {
    id: "ADM001",
    fullName: "Alice Admin",
    email: "alice.admin@hospital.com",
    phone: "+91 9000000001",
    role: "Admin",
    username: "aliceadmin",
    dateOfJoining: "2021-01-10",
    profilePic: "",
    hospital: "Central Hospital",
  },
  Doctor: {
    id: "DOC123",
    fullName: "Dr. Jane Doe",
    email: "jane.doe@hospital.com",
    phone: "+91 9876543210",
    role: "Doctor",
    username: "janedoe",
    dateOfJoining: "2022-03-15",
    profilePic: "",
    hospital: "City Hospital",
    department: "Cardiology",
    specialization: "Interventional Cardiology",
    scheduleLink: "#",
  },
  PharmaAdmin: {
    id: "PHA456",
    fullName: "Paul Pharma",
    email: "paul.pharma@hospital.com",
    phone: "+91 9123456789",
    role: "PharmaAdmin",
    username: "paulpharma",
    dateOfJoining: "2023-06-01",
    profilePic: "",
    hospital: "Westside Hospital",
    inventoryZone: "Zone A",
    shift: "Morning (8am-4pm)",
  },
};

export const UserContext = createContext<{
  user: User;
  setUserRole: (role: UserRole) => void;
}>({
  user: USERS.Admin,
  setUserRole: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Ensure the default is 'Admin' and not 'PharmaAdmin'
  const [userRole, setUserRole] = useState<UserRole>("Admin");
  const user = USERS[userRole];
  return (
    <UserContext.Provider value={{ user, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
}; 