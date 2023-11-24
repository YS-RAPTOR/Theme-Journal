const ThemeCreator = () => {
    return (
        <div>
            <form>
                <label>Theme Description</label>
                <input type="text" name="themeDescription" />
                <label>Start Date</label>
                <input type="date" name="startDate" />
                <label>End Date</label>
                <input type="date" name="endDate" />
                <label>Objective 1</label>
                <input type="text" name="objective1" />
                <label>Objective 2</label>
                <input type="text" name="objective2" />
                <label>Objective 3</label>
                <input type="text" name="objective3" />
            </form>
        </div>
    );
};

export default ThemeCreator;
