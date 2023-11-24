import { Link } from "react-router-dom";
import Profile from "../components/Profile";
import SignInOut from "../components/SignInOut";

const Root = () => {
    return (
        <div>
            <div>
                <Profile />
            </div>
            <div>
                <SignInOut />
            </div>
            <div>
                <Link to="/see-tasks">View Tasks</Link>
                <Link to="/create-task">Add Task</Link>
                <Link to="/create-theme">Theme Creator</Link>
                <Link to="/gratitudes-and-thoughts">
                    Gratitude and Thoughts
                </Link>
            </div>
        </div>
    );
};

export default Root;
