"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, UserPlus, UserMinus, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

// SWR fetcher using standard fetch API
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RolesPage() {
  // Fetch roles data from the API endpoint. The endpoint should return a JSON object with a "data" field
  // containing the roles, each with a "users" array property.
  const { data: rolesData, error: rolesError, mutate: mutateRoles } = useSWR("/api/roles", fetcher);

  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  if (rolesError) return <p>Error loading roles.</p>;
  if (!rolesData) return <p>Loading...</p>;

  // Toggle role expansion to show/hide list of users
  const toggleRole = (roleId: string) => {
    setExpandedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  // Handler to add a new role using the API
  const handleAddRole = async () => {
    try {
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newRoleName }),
      });

      if (!response.ok) throw new Error("Failed to add role");

      toast.success("Role added successfully");
      setNewRoleName("");
      setIsAddingRole(false);
      mutateRoles();
    } catch (error) {
      toast.error("Failed to add role");
    }
  };

  // Handler to delete a role using the API
  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete role");

      toast.success("Role deleted successfully");
      mutateRoles();
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  // Handler to add a user to a role (by email) via API
  const handleAddUserToRole = async () => {
    if (!selectedRole) return;

    try {
      const response = await fetch(`/api/roles/${selectedRole.id}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) throw new Error("Failed to add user to role");

      toast.success("User added to role successfully");
      setUserEmail("");
      setIsAddingUser(false);
      mutateRoles();
    } catch (error) {
      toast.error("Failed to add user to role");
    }
  };

  // Handler to remove a user from a role via API
  const handleRemoveUserFromRole = async (roleId: string, userId: string) => {
    if (!confirm("Are you sure you want to remove this user from the role?")) return;

    try {
      const response = await fetch(`/api/roles/${roleId}/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove user from role");

      toast.success("User removed from role successfully");
      mutateRoles();
    } catch (error) {
      toast.error("Failed to remove user from role");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <Dialog open={isAddingRole} onOpenChange={setIsAddingRole}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>Create a new role for your application.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddRole}>
                Add Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {rolesData.data.map((role: any) => (
          <div key={role.id} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-primary cursor-pointer hover:bg-slate-900"
              onClick={() => toggleRole(role.id)}
            >
              <div className="flex items-center space-x-2">
                {expandedRoles.has(role.id) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <span className="font-medium">{role.name}</span>
                <span className="text-sm text-gray-500">
                  ({role.users?.length || 0} users)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Dialog
                  open={isAddingUser && selectedRole?.id === role.id}
                  onOpenChange={(open) => {
                    setIsAddingUser(open);
                    if (!open) setSelectedRole(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRole(role);
                        setIsAddingUser(true);
                      }}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add User to {role.name}</DialogTitle>
                      <DialogDescription>
                        Add a user to this role by their email.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddUserToRole}>
                        Add User
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRole(role.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {expandedRoles.has(role.id) && (
              <div className="p-4 border-t">
                <div className="space-y-2">
                  {role.users && role.users.length > 0 ? (
                    role.users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between py-2">
                        <span>{user.email}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveUserFromRole(role.id, user.id)}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-2">
                      No users in this role
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
