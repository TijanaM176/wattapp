namespace API.Models.HelpModels
{
    public class SelectedNeigborhood
    {
        public SelectedNeigborhood(string id, string neigbName)
        {
            Id = id;
            NeigbName = neigbName;
        }

        public string Id { get; set; } = null!;

        public string NeigbName { get; set; } = null!;
    }
}
