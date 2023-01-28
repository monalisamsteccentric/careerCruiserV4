import mongoose from "mongoose";
const jobpostingSchema = new mongoose.Schema({
    
        jobpost: { type: String},
        date: { type: String },
        Title: { type: String },
        Company: { type: String },
        AnnouncementCode: { type: String },
        Term: { type: String },
        Eligibility: { type: String },
        Audience: { type: String },
        StartDate: { type: String },
        Duration: { type: String },
        Location: { type: String },
        JobDescription: { type: String },
        JobRequirment: { type: String },
        RequiredQual: { type: String},
        Salary: { type: String},
        ApplicationP: { type: String},
        OpeningDate: { type: String},
        Deadline: { type: String},
        Notes: { type: String},
        AboutC: { type: String},
        Attach: { type: String},
        Year: { type: String},
        Month: { type: String},
        IT: { type: String}
      
  });
  const Jobposting = mongoose.model('Jobposting', jobpostingSchema);
  
  export default Jobposting