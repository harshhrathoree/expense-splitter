import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MembersCard({ members, addMemberButton }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Members ({members.length})</CardTitle>

          {addMemberButton}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member._id}
              className="
                    flex
                    justify-between
                    items-center
                    border-b
                    pb-2
                  "
            >
              <div>
                <p className="font-medium">{member.user.name}</p>

                <p className="text-sm text-muted-foreground">
                  {member.user.email}
                </p>
              </div>

              <span className="text-sm">{member.role}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default MembersCard;
