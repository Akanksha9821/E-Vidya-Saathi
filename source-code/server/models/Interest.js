const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    name: {
      type: String,
      required: true
    },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    keywords: [{
      type: String
    }]
  }],
  preferences: {
    preferredTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'weekend', 'any'],
      default: 'any'
    },
    preferredLocation: {
      type: String
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  },
  eventInteractions: [{
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event'
    },
    type: {
      type: String,
      enum: ['view', 'register', 'attend', 'like', 'dislike', 'feedback'],
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update timestamp on save
InterestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add category to interests
InterestSchema.methods.addCategory = async function(category) {
  if (this.categories.some(cat => cat.name === category.name)) {
    throw new Error('Category already exists');
  }
  this.categories.push(category);
  await this.save();
};

// Update category in interests
InterestSchema.methods.updateCategory = async function(categoryName, updates) {
  const category = this.categories.find(cat => cat.name === categoryName);
  if (!category) {
    throw new Error('Category not found');
  }
  Object.assign(category, updates);
  await this.save();
};

// Remove category from interests
InterestSchema.methods.removeCategory = async function(categoryName) {
  this.categories = this.categories.filter(cat => cat.name !== categoryName);
  await this.save();
};

// Add event interaction
InterestSchema.methods.addInteraction = async function(interaction) {
  this.eventInteractions.push(interaction);
  await this.save();
};

// Get interest statistics
InterestSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $unwind: '$categories'
    },
    {
      $group: {
        _id: '$categories.name',
        count: { $sum: 1 },
        avgSkillLevel: {
          $avg: {
            $switch: {
              branches: [
                { case: { $eq: ['$categories.skillLevel', 'beginner'] }, then: 1 },
                { case: { $eq: ['$categories.skillLevel', 'intermediate'] }, then: 2 },
                { case: { $eq: ['$categories.skillLevel', 'advanced'] }, then: 3 }
              ],
              default: 0
            }
          }
        }
      }
    }
  ]);

  return stats;
};

// Get similar interests
InterestSchema.statics.findSimilar = async function(studentId) {
  const student = await this.findOne({ student: studentId });
  if (!student) {
    throw new Error('Student interests not found');
  }

  const similarStudents = await this.aggregate([
    {
      $match: {
        student: { $ne: mongoose.Types.ObjectId(studentId) }
      }
    },
    {
      $addFields: {
        similarityScore: {
          $reduce: {
            input: '$categories',
            initialValue: 0,
            in: {
              $add: [
                '$$value',
                {
                  $cond: {
                    if: {
                      $in: ['$$this.name', student.categories.map(c => c.name)]
                    },
                    then: 1,
                    else: 0
                  }
                }
              ]
            }
          }
        }
      }
    },
    {
      $match: {
        similarityScore: { $gt: 0 }
      }
    },
    {
      $sort: { similarityScore: -1 }
    },
    {
      $limit: 10
    }
  ]);

  return similarStudents;
};

module.exports = mongoose.model('Interest', InterestSchema); 