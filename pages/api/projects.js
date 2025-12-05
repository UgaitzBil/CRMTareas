import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      let data = await kv.get('crm-data');
      if (!data) {
        data = {
          categories: [
            { name: "Bases de Datos", image: "IMG/BBDD.jpg" },
            { name: "Redes", image: "IMG/REDES.png" },
            { name: "Desarrollo Web", image: "IMG/WEB.jpg" },
            { name: "Sistemas Operativos", image: "IMG/SistemasOperativos.jpg" },
            { name: "Digitalización", image: "IMG/digi.jpg" },
            { name: "default", image: "IMG/default.png" }
          ],
          projects: []
        };
        await kv.set('crm-data', data);
      }
      res.status(200).json(data);
    } else if (req.method === "POST") {
      const project = req.body;
      project.id = Date.now();
      project.tasks = project.tasks || [];
      
      let data = await kv.get('crm-data');
      if (!data) {
        data = {
          categories: [
            { name: "Bases de Datos", image: "IMG/BBDD.jpg" },
            { name: "Redes", image: "IMG/REDES.png" },
            { name: "Desarrollo Web", image: "IMG/WEB.jpg" },
            { name: "Sistemas Operativos", image: "IMG/SistemasOperativos.jpg" },
            { name: "Digitalización", image: "IMG/digi.jpg" },
            { name: "default", image: "IMG/default.png" }
          ],
          projects: []
        };
      }
      data.projects.push(project);
      await kv.set('crm-data', data);
      res.status(200).json(project);
    } else if (req.method === "PUT") {
      const { id, data: updateData } = req.body;
      let data = await kv.get('crm-data');
      if (data) {
        data.projects = data.projects.map(p => p.id === id ? { ...p, ...updateData } : p);
        await kv.set('crm-data', data);
      }
      res.status(200).json({ success: true });
    } else if (req.method === "DELETE") {
      const { id } = req.body;
      let data = await kv.get('crm-data');
      if (data) {
        data.projects = data.projects.filter(p => p.id !== id);
        await kv.set('crm-data', data);
      }
      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}