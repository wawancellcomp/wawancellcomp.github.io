export function createProjectFilter(projects) {
  const searchableProjects = projects.map((project) => ({
    project,
    searchableText: [
      project.title,
      project.category,
      project.description,
      project.stack.join(' '),
    ]
      .join(' ')
      .toLocaleLowerCase('id'),
  }));

  return (category, query) => {
    const normalizedQuery = query.trim().toLocaleLowerCase('id');

    return searchableProjects
      .filter(
        ({ project, searchableText }) =>
          (category === 'Semua' || project.category === category) &&
          (!normalizedQuery || searchableText.includes(normalizedQuery)),
      )
      .map(({ project }) => project);
  };
}
