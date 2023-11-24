import { useMsal, AuthenticatedTemplate } from "@azure/msal-react";

const Profile = () => {
    const { instance } = useMsal();
    return (
        <AuthenticatedTemplate>
            {instance.getActiveAccount()?.name}
        </AuthenticatedTemplate>
    );
};

export default Profile;
