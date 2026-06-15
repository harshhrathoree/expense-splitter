import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createGroup, deleteGroup } from "@/services/group.service";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGroups } from "@/services/group.service";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Plus, 
  Users, 
  ChevronRight, 
  Hash,
  UserPlus,
  Search,
  Trash2,
  AlertTriangle,
  Loader2
} from "lucide-react";

function Groups() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchGroups = async () => {
    try {
      const data = await getGroups(accessToken);
      setGroups(data.groups);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Group name is required");
      return;
    }

    try {
      setCreating(true);
      const data = await createGroup(
        {
          name: name.trim(),
          description: description.trim(),
        },
        accessToken,
      );

      setGroups((prev) => [data.group, ...prev]);
      setName("");
      setDescription("");
      setOpen(false);
      toast.success("Group created");
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      setDeleting(groupId);
      await deleteGroup(groupId, accessToken);
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      toast.success("Group deleted");
      setDeleteOpen(null);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete group");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    document.title = "Groups | Expense Splitter";
    if (!accessToken) return;
    
    const loadGroups = async () => {
      try {
        await fetchGroups();
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [accessToken]);

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMemberCountText = (count) => {
    if (count === 0) return "No members";
    if (count === 1) return "1 member";
    return `${count} members`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight">
              Groups
            </h1>
            <p className="text-sm text-stone-500 mt-1 font-light">
              Manage your shared expense groups
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md border-stone-200 bg-white">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium text-stone-900">
                  Create a new group
                </DialogTitle>
                <DialogDescription className="text-sm text-stone-500 font-light mt-1">
                  Start splitting expenses with friends
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateGroup} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-stone-700">
                    Group Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Goa Trip, Apartment 4B"
                    className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-stone-700">
                    Description
                    <span className="text-stone-400 font-light ml-1">(optional)</span>
                  </Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this group about?"
                    className="border-stone-200 bg-stone-50/50 focus:border-stone-400 focus:ring-0 rounded-lg text-sm resize-none"
                    rows={3}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-light">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                      setName("");
                      setDescription("");
                      setError("");
                    }}
                    className="flex-1 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-normal h-11 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal h-11 rounded-lg"
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Group"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        {!loading && groups.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-stone-200 bg-white focus:border-stone-400 focus:ring-0 rounded-lg h-11 text-sm"
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-stone-200 shadow-none animate-pulse">
                <CardContent className="p-4 md:p-6">
                  <div className="h-5 bg-stone-200 rounded w-48 mb-3"></div>
                  <div className="h-4 bg-stone-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-stone-200 rounded w-24"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <Card className="border-stone-200 shadow-none bg-white">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-7 h-7 text-stone-400" />
              </div>
              <h3 className="text-lg font-medium text-stone-900 mb-1">
                No groups yet
              </h3>
              <p className="text-sm text-stone-500 font-light mb-6 max-w-sm mx-auto">
                Create your first group to start tracking shared expenses with friends and family
              </p>
              <Button
                onClick={() => setOpen(true)}
                className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-normal"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Group
              </Button>
            </CardContent>
          </Card>
        ) : filteredGroups.length === 0 ? (
          <Card className="border-stone-200 shadow-none bg-white">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-stone-400" />
              </div>
              <h3 className="text-lg font-medium text-stone-900 mb-1">
                No groups found
              </h3>
              <p className="text-sm text-stone-500 font-light">
                No groups match "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {filteredGroups.map((group) => (
              <Card
                key={group._id}
                className="border-stone-200 shadow-none hover:border-stone-300 hover:shadow-sm transition-all duration-200 bg-white group relative"
              >
                {/* Delete button - top right */}
                <div 
                  className="absolute top-3 right-3 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dialog 
                    open={deleteOpen === group._id} 
                    onOpenChange={(val) => setDeleteOpen(val ? group._id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md border-stone-200 bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-stone-900 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          Delete Group
                        </DialogTitle>
                        <DialogDescription className="text-sm text-stone-500 font-light mt-1">
                          Permanently delete "{group.name}"?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <p className="text-sm text-red-700 font-light">
                            All expenses, settlements, and group data will be permanently deleted.
                            All members must be settled first.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setDeleteOpen(null)}
                            className="flex-1 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-normal h-11 rounded-lg"
                            disabled={deleting === group._id}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleDeleteGroup(group._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-normal h-11 rounded-lg"
                            disabled={deleting === group._id}
                          >
                            {deleting === group._id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete Group"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Card content - clickable */}
                <CardContent 
                  className="p-4 md:p-6 cursor-pointer"
                  onClick={() => navigate(`/groups/${group._id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Hash className="w-4 h-4 text-stone-500" />
                        </div>
                        <CardTitle className="text-base md:text-lg font-medium text-stone-900 group-hover:text-stone-700 transition-colors truncate">
                          {group.name}
                        </CardTitle>
                      </div>
                      
                      {group.description && (
                        <p className="text-sm text-stone-500 font-light ml-10 line-clamp-1">
                          {group.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-3 ml-10">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span className="text-xs text-stone-400 font-light">
                          {getMemberCountText(group.members.length)}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-stone-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Groups;