// Add this plugin configuration because Jest don't catch up with `assert {type: 'json'}` used in services/jobs-and-skills-api/_confs/elasticConf.js
export default {
  plugins: [
    '@babel/plugin-syntax-import-assertions'
  ]
}