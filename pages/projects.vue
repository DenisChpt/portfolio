<template>
	<!-- Conteneur principal de la page -->
	<main class="flex flex-col flex-auto lg:flex-row overflow-hidden">
		<!-- ==============================
		   Section 1 : Titre affiché en mobile
		   ============================== -->
		<div id="mobile-page-title">
			<h2>_projects</h2>
		</div>

		<!-- ==============================
		   Section 2 : Menu latéral de filtres
		   - Affiche le titre "projects" avec une flèche cliquable.
		   - Contient la liste des checkboxes pour sélectionner/désélectionner les technos.
		   ============================== -->
		<div id="filter-menu" class="filter-menu-container font-fira_regular text-menu-text">
			<!-- Titre cliquable pour afficher/masquer la liste des filtres -->
			<div
				id="section-content-title"
				class="flex items-center min-w-full"
				@click="showFilters = !showFilters"
			>
				<!-- Flèche qui pivote selon l'état d'affichage -->
				<img
					id="section-arrow-menu"
					src="/icons/arrow.svg"
					alt=""
					class="section-arrow mx-3"
					:class="{ open: showFilters }"
				/>
				<p class="font-fira_regular text-white text-sm">projects</p>
			</div>

			<!-- Liste des checkboxes pour les technos :
			 - La liste est toujours présente dans le DOM
			 - Sa visibilité est contrôlée par l'état "showFilters" via la classe .hidden -->
			<div class="tech-list" :class="{ hidden: !showFilters }">
				<!-- Boucle sur chaque techno présente dans le tableau "techs" -->
				<div
					v-for="tech in techs"
					:key="tech"
					class="flex items-center py-2 hover:text-white cursor-pointer"
				>
					<!-- Checkbox pour la techno avec appel à la fonction filterProjects au clic -->
					<input type="checkbox" :id="tech" @click="filterProjects(tech)" />
					<!-- Icône associée à la techno -->
					<img
						:id="'icon-tech-' + tech"
						:src="'/icons/techs/' + tech + '.svg'"
						alt=""
						class="tech-icon w-5 h-5 mx-4"
					/>
					<!-- Label affichant le nom de la techno -->
					<label :for="tech" :id="'title-tech-' + tech">
						{{ tech }}
					</label>
				</div>
			</div>
		</div>

		<!-- ==============================
		   Section 3 : Contenu principal (onglets et projets)
		   ============================== -->
		<div class="flex flex-col w-full overflow-hidden">
			<!-- 3.a Onglet desktop : affiche la liste des filtres actifs -->
			<div class="tab-height w-full hidden lg:flex border-bot items-center">
				<div class="flex items-center border-right h-full">
					<!-- Boucle sur les filtres actifs pour les afficher -->
					<p
						v-for="filter in filters"
						:key="filter"
						class="font-fira_regular text-menu-text text-sm px-3"
					>
						{{ filter }};
					</p>
					<!-- Icône pour éventuellement effacer ou fermer le filtre (fonctionnalité à compléter) -->
					<img src="/icons/close.svg" alt="" class="m-3" />
				</div>
			</div>

			<!-- 3.b Onglet mobile (optionnel) : affiche le titre "projects" suivi des filtres actifs -->
			<div id="tab" class="flex lg:hidden items-center">
				<span class="text-white">// </span>
				<p class="font-fira_regular text-white text-sm px-3">projects</p>
				<span class="text-menu-text"> / </span>
				<!-- Boucle sur les filtres actifs -->
				<p
					v-for="filter in filters"
					:key="filter"
					class="font-fira_regular text-menu-text text-sm px-3"
				>
					{{ filter }};
				</p>
			</div>

			<!-- 3.c Wrapper pour la grille des projets et le message d'absence de résultat -->
			<div id="projects-wrapper" class="relative flex-auto">
				<!-- Transition-group pour animer l'apparition/disparition des projets -->
				<transition-group
					appear
					name="projects"
					tag="div"
					id="projects-case"
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto py-16 place-items-center"
					leave="leave"
				>
					<!-- Composant project-card pour chaque projet filtré -->
					<project-card
						v-for="(project, index) in projects"
						:key="project.title"
						:index="index"
						:project="project"
					/>
				</transition-group>

				<!-- Message affiché en cas d'absence de projets correspondant aux filtres
			   - La transition "fade" gère son apparition/disparition -->
				<transition name="fade" appear>
					<div
						v-if="projects.length === 0"
						class="absolute inset-0 flex flex-col items-center justify-center font-fira_retina text-menu-text"
					>
						<span class="text-4xl pb-3">X__X</span>
						<span class="text-white text-xl">No matching projects</span>
						<span>for these technologies</span>
					</div>
				</transition>
			</div>
		</div>
	</main>
</template>

<script setup>
/*
	Ce script utilise l'API Composition de Vue pour gérer :
	  - La liste des technos disponibles
	  - Les filtres actifs et la visibilité de la liste des filtres
	  - Le chargement et le filtrage des projets à partir d'un fichier JSON
  */

import { ref } from 'vue'
import DevConfig from '~/developer.json' // Import du fichier de configuration contenant les projets

// Tableau des technos disponibles pour le filtrage
const techs = ['React', 'HTML', 'CSS', 'Vue', 'Angular', 'Gatsby', 'Flutter']

// Réactive "filters" contenant les filtres actifs (initialisé par défaut à "all")
const filters = ref(['all'])

// Réactive "showFilters" pour afficher/masquer la liste des checkboxes
const showFilters = ref(false)

// Chargement de la configuration (projets) depuis le fichier JSON
const config = ref(DevConfig)
const projects = ref(config.value.projects)

/**
 * Fonction appelée lors du clic sur une checkbox de techno.
 *
 * - Si la checkbox est cochée :
 *    * Supprime le filtre "all" s'il est présent
 *    * Ajoute la techno sélectionnée dans le tableau des filtres
 *
 * - Si la checkbox est décochée :
 *    * Retire la techno du tableau des filtres
 *    * Si aucun filtre n'est actif, rétablit le filtre "all"
 *
 * Ensuite, met à jour la liste des projets affichés en fonction des filtres actifs.
 *
 * @param {string} tech - La techno sélectionnée ou désélectionnée.
 */
function filterProjects(tech) {
	// Récupère l'élément checkbox via son id
	const checkbox = document.getElementById(tech)

	// Ajout ou retrait de la techno dans le tableau des filtres selon l'état de la checkbox
	if (checkbox.checked) {
		filters.value = filters.value.filter((item) => item !== 'all')
		filters.value.push(tech)
	} else {
		filters.value = filters.value.filter((item) => item !== tech)
		// Si aucun filtre n'est actif, on remet "all"
		if (filters.value.length === 0) {
			filters.value.push('all')
		}
	}

	// Mise à jour de la liste des projets en fonction des filtres actifs
	if (filters.value[0] === 'all') {
		projects.value = config.value.projects
	} else {
		projects.value = filterProjectsBy(filters.value)
	}
}

/**
 * Filtre les projets en ne gardant que ceux qui incluent au moins une
 * des technos sélectionnées dans leur liste "tech".
 *
 * @param {Array<string>} selectedTechs - Tableau des technos actives.
 * @returns {Array<Object>} Liste des projets correspondants.
 */
function filterProjectsBy(selectedTechs) {
	const allProjects = Object.values(config.value.projects)
	return allProjects.filter((project) => selectedTechs.some((tech) => project.tech.includes(tech)))
}
</script>

<style scoped>
/*
	===============================
	1) Styles du conteneur "projects" + checkboxes
	===============================
  */
.filter-menu-container {
	min-width: 250px;
	border-right: 1px solid #1e2d3d;
	display: flex;
	flex-direction: column;
}

#section-content-title {
	height: 35px;
	display: flex;
	align-items: center;
	padding: 0 25px;
	border-bottom: 1px solid #1e2d3d;
	cursor: pointer;
}

/* La flèche pivote à 90° lors de l'ouverture des filtres */
.section-arrow {
	margin-right: 10px;
	transition: 0.1s;
}
.section-arrow.open {
	transform: rotate(90deg);
}

/*
	La liste des technos (checkboxes) est masquée via .hidden :
	- L'opacité passe à 0 et les événements de la souris sont désactivés.
  */
.tech-list {
	opacity: 1;
	transition: opacity 0.3s ease;
	pointer-events: auto;
	padding: 10px 25px;
}
.tech-list.hidden {
	opacity: 0;
	pointer-events: none;
}

/*
	===============================
	2) Styles pour les checkboxes personnalisées
	===============================
  */
input[type='checkbox'] {
	appearance: none;
	background-color: transparent;
	width: 1.15em;
	height: 1.15em;
	border: 2px solid currentColor;
	border-radius: 0.15em;
	margin-top: 1px;
}

input[type='checkbox']:checked {
	background-color: currentColor;
	background-image: url("data:image/svg+xml;utf8,<svg width='13' height='10' viewBox='0 0 13 10' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5.38587 7.2802L11.9718 0.693573L12.9856 1.70668L5.38587 9.30641L0.826172 4.74671L1.83928 3.73361L5.38587 7.2802Z' fill='white'/></svg>");
	background-repeat: no-repeat;
	background-position: center;
}

input[type='checkbox']:checked:hover {
	box-shadow: #607b968b 0px 0px 0px 2px;
}

input[type='checkbox']:not(:checked) {
	border-color: currentColor;
}

input[type='checkbox']:hover {
	cursor: pointer;
	background-color: currentColor;
	background-image: url("data:image/svg+xml;utf8,<svg width='13' height='10' viewBox='0 0 13 10' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5.38587 7.2802L11.9718 0.693573L12.9856 1.70668L5.38587 9.30641L0.826172 4.74671L1.83928 3.73361L5.38587 7.2802Z' fill='white'/></svg>");
	background-repeat: no-repeat;
	background-position: center;
	box-shadow: #607b968b 0px 0px 0px 2px;
}

input[type='checkbox']:hover:not(:checked) {
	background-color: rgba(0, 0, 0, 0.1);
	background-image: none;
	box-shadow: #607b968b 0px 0px 0px 2px;
}

input[type='checkbox']:focus {
	box-shadow: none;
}

/* Icône de techno en légère opacité, passe à 1 quand actif */
.tech-icon {
	opacity: 0.4;
}
.tech-icon.active {
	opacity: 1;
}

/*
	===============================
	3) Transition-group pour les projets
	- Animation pour l'apparition, disparition et repositionnement des éléments
	===============================
  */
.projects-enter-active,
.projects-leave-active {
	transition: all 0.5s ease;
}

.projects-enter-from {
	opacity: 0;
	transform: scale(0.7);
}

.projects-leave-to {
	opacity: 0;
	transform: scale(0.7);
}

/* Animation pour le déplacement des éléments */
.projects-move {
	transition: transform 0.5s ease;
}

/*
	Positionnement relatif du wrapper pour permettre l'affichage absolu
	du message "No matching projects" au centre.
  */
#projects-wrapper {
	position: relative;
}

/*
	===============================
	4) Transition fade pour le message "No matching projects"
	===============================
  */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
/*
	===============================
	5) Grille des projets ("projects-case")
	- Affiche 1 colonne en mobile, 2 colonnes en tablette et 3 en grand écran
	===============================
  */
/* (Définition déjà appliquée dans la balise <transition-group>) */
</style>
