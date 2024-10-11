import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const WebsiteContentSchema = new mongoose.Schema(
  {
    hero: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: true,
      },
      buttonText: {
        type: String,
        required: true,
      },
      buttonLink: {
        type: String,
        required: true,
      },
      backgroundImage: {
        type: String,
        required: true,
      },
    },
    about: {
      vision: {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        icon: {
          type: String, // Optional icon field
        },
      },
      mission: {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        icon: {
          type: String, // Optional icon field
        },
      },
    },
    programs: [ProgramSchema],
    partners: [PartnerSchema],
  },
  { timestamps: true }
);

const WebsiteContent = mongoose.model("WebsiteContent", WebsiteContentSchema);

export default WebsiteContent;
