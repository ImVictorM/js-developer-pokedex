const root = document.getElementById('root');

async function fetchPokemonByID (id) {
  const endpoint = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const pokemon = await fetch(endpoint).then((response) => response.json());
  return pokemon;
}

async function getPokemonSpeciesData(speciesUrl) {
  const { 
    shape, 
    egg_groups, 
    growth_rate, 
    habitat 
  } = await fetch(speciesUrl).then((response) => response.json());

  return {
    shape,
    egg_groups,
    growth_rate,
    habitat
  };
}

async function generatePokemonHTML({ 
  name, 
  id, 
  types, 
  sprites, 
  species, 
  height, 
  weight, 
  base_experience,
  abilities 
}) {
  const { shape, egg_groups, growth_rate, habitat } = await getPokemonSpeciesData(species.url);
  const mainType = types[0].type.name;

  const HTML = `
    <main>
      <section class="pokemon ${mainType}">
        <section class="pokemon__display">
          <div>
            <h1 class="pokemon__display__name">${ name }</h1>

            <ul class="pokemon__display__types">
              ${ 
                types
                  .map(({ type }) => `<li class=${type.name}>${type.name}</li>`)
                  .join('') 
              }
            </ul>
          </div>

          <span>#${ ('0000'+id).slice(-4) }</span>
        </section>

        <img 
          src=${ sprites.other.dream_world.front_default } 
          alt=${ name }
          class="pokemon__sprite"
        />
        
        <section class="pokemon__about">
          <h2>About</h2>
          <div>
            <span>Base Exp ${base_experience}</span>
            <span>Height ${(height / 10).toFixed(2)} cm</span>
            <span>Weight ${(weight / 10).toFixed(2)} kg</span>
            <span>
              Abilities ${
                abilities
                  .map(({ ability }) => `${ability.name}`)
                  .join(', ')
              }
            </span>
          </div>
          <div class="pokemon__about__breeding">
            <h3>Breeding</h3>
            <span>Shape ${shape.name}</span>
            <span>Egg Groups ${
              egg_groups
                .map(({ name }) => name)
                .join(', ')
              }
            </span>
            <span>Growth Rate ${growth_rate.name}</span>
            <span>Habitat ${habitat.name}</span>
          </div>
        </section>
      </section>
    </main>
  `
  return HTML;
}

async function main() {
  const pokemonId = window.location.hash.slice(1);
  const pokemon = await fetchPokemonByID(pokemonId);
  const html = await generatePokemonHTML(pokemon);
  root.innerHTML = html;
}

window.onload = main;

