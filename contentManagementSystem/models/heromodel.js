
import mongoose from 'mongoose';

const WebsiteContentSchema = new mongoose.Schema({
    hero: {
      title: String,
      subtitle: String,
      buttonText: String,
      buttonLink: String,
      backgroundImage: String,
    },
    about: {
      vision: String,
      mission: String,
    },
    programs: [
      {
        title: String,
        description: String,
        image: String,
        link: String,
      }
    ],
    partners: [
      {
        name: String,
        logo: String,
        link: String
      }
    ],
    footer: {
      text: String,
      links: [{ label: String, url: String }],
    },
    updatedAt: { type: Date, default: Date.now }
  });
  
  const WebsiteContent = mongoose.model('WebsiteContent', WebsiteContentSchema);

  export default WebsiteContent;
  