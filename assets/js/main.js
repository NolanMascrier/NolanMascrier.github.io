document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    { name: "Physics Engine", link: "#" },
    { name: "3D Beat 'Em Up (Godot)", link: "#" },
    { name: "SlotPanel UI (Pygame)", link: "#" },
  ];

  const container = document.getElementById("project-list");
  projects.forEach(p => {
    const item = document.createElement("div");
    item.innerHTML = `<a href="${p.link}">${p.name}</a>`;
    container.appendChild(item);
  });
});
