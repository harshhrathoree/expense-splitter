import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Crown, Shield, User, LogOut, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { leaveGroup } from "@/services/group.service";

function MembersCard({ 
  members, 
  currentUserId, 
  isAdmin, 
  netBalances,
  groupId,
  accessToken,
  onLeaveGroup 
}) {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Check if current user has zero balance
  const hasZeroBalance = () => {
    if (!currentUserId || !netBalances?.length) return true;
    const userBalance = netBalances.find(
      (b) => b.user?.id === currentUserId || b.user === currentUserId
    );
    return !userBalance || userBalance.amount === 0;
  };

  // Get user's balance for display
  const getUserBalance = () => {
    if (!currentUserId || !netBalances?.length) return 0;
    const userBalance = netBalances.find(
      (b) => b.user?.id === currentUserId || b.user === currentUserId
    );
    return userBalance?.amount || 0;
  };

  const canLeave = !isAdmin && hasZeroBalance();

  const getLeaveBlockedReason = () => {
    if (isAdmin) return "Admins cannot leave the group. Transfer admin role first.";
    if (!hasZeroBalance()) {
      const balance = getUserBalance();
      if (balance > 0) {
        return `You are owed ₹${balance.toFixed(2)}. Settle all balances before leaving.`;
      } else {
        return `You owe ₹${Math.abs(balance).toFixed(2)}. Settle all balances before leaving.`;
      }
    }
    return null;
  };

  const handleLeaveGroup = async () => {
    // Double-check validation before making the API call
    if (isAdmin) {
      toast.error("Admins cannot leave the group");
      return;
    }
    
    if (!hasZeroBalance()) {
      toast.error("You must settle all balances before leaving the group");
      return;
    }

    try {
      setLeaving(true);
      await leaveGroup(groupId, accessToken);
      toast.success("You left the group");
      setLeaveOpen(false);
      if (onLeaveGroup) onLeaveGroup();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to leave group");
    } finally {
      setLeaving(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
      case "creator":
        return {
          icon: Crown,
          text: "Admin",
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "moderator":
        return {
          icon: Shield,
          text: "Moderator",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      default:
        return {
          icon: User,
          text: "Member",
          className: "bg-stone-50 text-stone-600 border-stone-200",
        };
    }
  };

  return (
    <Card className="border-stone-200 shadow-none bg-white">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-lg font-medium text-stone-900">
            Members
          </CardTitle>
          <p className="text-sm text-stone-500 font-light mt-0.5">
            {members.length} {members.length === 1 ? "member" : "members"} in this group
          </p>
        </div>
        
        {/* Leave Group Button - only for non-admin members */}
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <div className="relative group">
              <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`font-normal text-sm ${
                      canLeave 
                        ? "border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300" 
                        : "border-stone-200 text-stone-400 cursor-not-allowed"
                    }`}
                    disabled={!canLeave}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave Group
                  </Button>
                </DialogTrigger>
                
                {canLeave ? (
                  <DialogContent className="sm:max-w-md border-stone-200 bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-medium text-stone-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Leave Group
                      </DialogTitle>
                      <DialogDescription className="text-sm text-stone-500 font-light mt-1">
                        Are you sure you want to leave this group?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm text-red-700 font-light">
                          You won't be able to see this group's expenses or balances anymore.
                          This action cannot be undone from here.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setLeaveOpen(false)}
                          className="flex-1 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-normal h-11 rounded-lg"
                          disabled={leaving}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleLeaveGroup}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-normal h-11 rounded-lg"
                          disabled={leaving}
                        >
                          {leaving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Leaving...
                            </>
                          ) : (
                            "Leave Group"
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                ) : (
                  // Show tooltip-like message when button is disabled
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-stone-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {getLeaveBlockedReason()}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-800"></div>
                  </div>
                )}
              </Dialog>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-stone-400" />
            </div>
            <p className="text-sm text-stone-500 font-light">No members yet</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 -mx-2">
            {members.map((member) => {
              const roleBadge = getRoleBadge(member.role);
              const memberId = member.user?._id || member.user;
              const isSelf = memberId === currentUserId;
              
              return (
                <div
                  key={member._id || memberId}
                  className="flex items-center justify-between py-3 px-2 hover:bg-stone-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-stone-600">
                        {member.user?.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">
                        {member.user?.name}
                        {isSelf && (
                          <span className="text-xs text-stone-400 font-light ml-1">(you)</span>
                        )}
                      </p>
                      <p className="text-xs text-stone-400 font-light truncate">
                        {member.user?.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ml-3 ${roleBadge.className}`}
                  >
                    <roleBadge.icon className="w-3 h-3" />
                    {roleBadge.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MembersCard;