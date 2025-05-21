namespace API.Models
{
    public class Column
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public int ProjectId { get; set; } // Foreign key to Project
        public Project Project { get; set; } // Navigation property
    }
}
