let projects = [];

export default async function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(projects);
  } else if (req.method === "POST") {
    const project = req.body;
    project.id = Date.now();
    project.tasks = project.tasks || [];
    projects.push(project);
    res.status(200).json(project);
  } else if (req.method === "PUT") {
    const { id, data } = req.body;
    projects = projects.map(p => p.id === id ? { ...p, ...data } : p);
    res.status(200).json({ success: true });
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    projects = projects.filter(p => p.id !== id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

// Note: This is a simple in-memory storage. In a real application, you would use a database.