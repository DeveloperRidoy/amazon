const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    uniqueCaseInsensitive: true,
    required: [true, "Please provide a name for your menu"],
  }, 
  slug: {
    type: String,
    index: true,
    validate: {
      validator: (val) => val === "",
      message: "slug is automatically generated.Please leave this field empty",
    },
  },
  menus: [
    {
      title: {
        type: String,
        required: [true, "please provide title"],
      },
      options: [
        {
          link: {
            type: String,
            required: [true, "please provide link url"],
          },
          text: {
            type: String,
            required: [true, "please provide link text"],
          },
          submenus: [
            {
              title: {
                type: String,
                required: [true, "please provide title"],
              },
              options: [
                {
                  link: {
                    type: String,
                    required: [true, "please provide link url"],
                  },
                  text: {
                    type: String,
                    required: [true, "please provide link text"],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

// error message for unique fields
menuSchema.plugin(uniqueValidator, {
    message: 'There\'s already a menu with the same {PATH}'
})

// create slug before creating the menu
menuSchema.pre('save', function (next) { //doesn't work on update
    this.slug = this.name.toLowerCase().split(' ').join('-');
    next();
})

const Menu = mongoose.model('menu', menuSchema);

module.exports = Menu;