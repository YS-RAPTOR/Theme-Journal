namespace ThemeJournal.ServiceLibrary.Models
{
    public class GratitudeModel
    {
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public float? Sentiment { get; set; }
    }
}
