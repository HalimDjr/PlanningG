import { ThemeItem } from "./theme-item";

export type Theme = {
  id: string;
  nom: string;

  createdAt: Date;
  themeSpecialites: ThemeSpecialite[];
  proposePar: Enseignant | null;
};

export type ThemeSpecialite = {
  themeId: string;
  specialiteId: string;
  specialite: {
    nom: string;
  };
};

export type Enseignant = {
  nom: string;
  prenom: string;
};

export const ListThemes = ({ themes }: { themes: Theme[] }) => {
  return (
    <div>
      {!!themes && (
        <div className="grid grid-cols-1  gap-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4">
          {themes.map((theme) => (
            <ThemeItem
              key={theme.id}
              nom={theme.nom}
              id={theme.id}
              specialite={theme.themeSpecialites}
              proposePar={
                `${theme.proposePar?.nom} ${theme.proposePar?.prenom}` || ""
              }
              createdAt={theme.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};
