const CreateTasks = () => {
    // Create a task only has name
    // - Task Description
    // - Partial Completion Requirements
    // - Full Completion Requirements
    // - Task Start Date
    // - Task End Date
    // - Daily Progress

    return (
        <div>
            <form>
                <label>Task Description</label>
                <input type="text" />
                <label>Partial Completion Requirements</label>
                <input type="text" />
                <label>Full Completion Requirements</label>
                <input type="text" />
                <label>Task Start Date</label>
                <input type="text" />
                <label>Task End Date</label>
                <input type="text" />
                <label>Daily Progress</label>
                <input type="text" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateTasks;
