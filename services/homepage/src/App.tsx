import './App.css'

function App() {
  const services = [
    { label: 'Application', httpPath: 'profile' },
    { label: 'Admin Jobsong', httpPath: 'admin' },
    { label: 'Graphql', httpPath: 'graphql' },
    { label: 'Storybook', httpPath: 'https://ds-mindmatcher-dev-wyew76oo4a-ew.a.run.app/' },
  ]
  return (
    <>
      <div>
        {/* !!!! This links in production lead to other services. Homepage standalone service catch all sub path */}
        {services.map((s, i) => <h2 key={i}><a href={s.httpPath} target='_blank'>{s.label}</a></h2>)}
      </div>
    </>
  )
}

export default App
