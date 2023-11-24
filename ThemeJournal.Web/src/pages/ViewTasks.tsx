const ViewTasks = () => {
    return (
        <div>
            <Task name="Dumb" />
            <Task name="Task" />
        </div>
    );
};

const Task = ({ name }: { name: string }) => {
    return <div>{name}</div>;
};

export default ViewTasks;
