namespace ThemeJournal.ServiceLibrary.Models
{
    public class GetGratitudeModel
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public float? Sentiment { get; set; }
        public TimeOfDay Time { get; set; }
    }
}
