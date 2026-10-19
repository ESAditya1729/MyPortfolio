// One {position, target} keyframe per content section (src/data/content.js).
export const cameraPath = [
  { position: [0, 1.6, 3.4],    target: [0, 0.6, 0] },       // hero      — wide establishing shot
  { position: [1.4, 1.1, 1.6],  target: [0.3, 0.6, -0.1] },  // about     — move toward desk
  { position: [-1.1, 1.0, 0.9], target: [0, 0.55, -0.2] },   // skills    — pan toward monitor
  { position: [0.4, 0.65, 0.5], target: [0, 0.55, -0.2] },   // experience — close on monitor
  { position: [-0.6, 1.2, 1.4], target: [0.2, 0.65, 0] },    // projects  — pull back left, bookshelf side
  { position: [0, 1.9, 2.6],    target: [0, 0.6, 0] },        // contact   — pull back out
]
