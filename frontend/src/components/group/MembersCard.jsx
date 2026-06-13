import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Shield, User } from "lucide-react";

function MembersCard({ members, addMemberButton }) {
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
        {addMemberButton && <div className="flex-shrink-0">{addMemberButton}</div>}
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
              return (
                <div
                  key={member._id || member.user?._id}
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