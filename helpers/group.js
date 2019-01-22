module.exports = {
    createInvitationObj: (emails, groupId) => {
        let invitations = [];
        for (let i = 0; i < emails.length; i++) {
            invitations.push({
                email: emails[i],
                groupId
            })
        }
        return invitations;
    }
};