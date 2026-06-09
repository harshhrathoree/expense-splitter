import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createGroup } from "@/services/group.service";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getGroups } from "@/services/group.service";
import useAuth from "@/hooks/useAuth";
function Groups() {
  const navigate = useNavigate();

  const { accessToken } = useAuth();

  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const handleCreateGroup = async () => {
    try {
      const data = await createGroup(
        {
          name,
          description,
        },
        accessToken,
      );

      setGroups((prev) => [...prev, data.group]);

      setName("");
      setDescription("");

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.title =
  "Groups | Expense Splitter";
    if (!accessToken) return;
    const fetchGroups = async () => {
      try {
        const data = await getGroups(accessToken);

        setGroups(data.groups);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [accessToken]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Groups</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Group</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Group</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Group Name</Label>

                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>Description</Label>

                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleCreateGroup}>
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <Card
              key={group._id}
              className="
         cursor-pointer
         hover:shadow-md
         transition
       "
              onClick={() => navigate(`/groups/${group._id}`)}
            >
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground">{group.description}</p>

                <p className="mt-3 text-sm">Members: {group.members.length}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Groups;
