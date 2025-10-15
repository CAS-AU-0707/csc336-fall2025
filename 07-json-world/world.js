import * as fs from 'fs';

const raw = fs.readFileSync(new URL('./world.json', import.meta.url), 'utf8');
const data = JSON.parse(raw);

function itemsToText(items = []) {
    const names = items.map(it => typeof it === 'string'
        ? it
        : it.rarity ? `${it.name} (${it.rarity})` : it.name);

    if (names.length === 0) return 'nothing in particular';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

function townLine(town) {
    return `In the town of ${town.name}, ${town.population} residents go about their day.`;
}

function tellTheStory(world) {
    const { regions = [] } = world;

    console.log('A Day in the World\n');

    regions.forEach((region, rIdx) => {
        console.log(`Welcome to ${region.name}, where the climate is ${region.climate}.`);

        (region.towns || []).forEach((town) => {
            console.log(townLine(town));

            (town.notable_people || []).forEach(person => {
                const itemsText = itemsToText(person.items);
                console.log(`${person.name}, the ${person.role}, keeps ${itemsText}.`);
            });
        });

        if (rIdx < regions.length - 1) console.log('\n— — —\n');
    });

    console.log('\nEnd of today’s travels.');
}

tellTheStory(data);
