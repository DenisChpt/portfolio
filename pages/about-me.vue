<template>
	<main v-if="!loading" id="about-me" class="page">
		<div id="mobile-page-title">
			<h2>{{ t('about_me') }}</h2>
		</div>
		<div id="page-menu" class="w-full flex">
			<!-- Menu latéral des sections -->
			<div id="sections">
				<div
					v-for="(section, key) in aboutSections"
					:key="key"
					:class="{ active: isSectionActive(section.title) }"
					@click="focusCurrentSection(section)"
				>
					<img :src="section.icon" :alt="section.title + '-section'" />
				</div>
			</div>
			<!-- Contenu de la section sélectionnée -->
			<div id="section-content" class="hidden lg:block w-full h-full border-right">
				<div id="section-content-title" class="hidden lg:flex items-center min-w-full">
					<img
						id="section-arrow-menu"
						src="/icons/arrow.svg"
						alt=""
						class="section-arrow mx-3 open"
					/>
					<p class="font-fira_regular text-white text-sm">{{ currentSectionTitle }}</p>
				</div>
				<div>
					<div
						v-for="(folder, key) in currentSectionInfo"
						:key="key"
						class="grid grid-cols-2 items-center my-2 font-fira_regular text-menu-text"
						@click="focusCurrentFolder(folder)"
					>
						<div class="flex col-span-2 hover:text-white hover:cursor-pointer">
							<img
								id="diple"
								src="/icons/diple.svg"
								:class="{ open: folderIsActive(folder.title) }"
							/>
							<img :src="`/icons/folder${key + 1}.svg`" alt="" class="mr-3" />
							<p v-html="folder.title" :class="{ active: folderIsActive(folder.title) }"></p>
						</div>
						<div v-if="folder.files" class="col-span-2">
							<div
								v-for="(file, fileKey) in folder.files"
								:key="fileKey"
								class="hover:text-white hover:cursor-pointer flex my-2"
							>
								<img src="/icons/markdown.svg" alt="" class="ml-8 mr-3" />
								<p>{{ fileKey }}</p>
							</div>
						</div>
					</div>
				</div>
				<div id="section-content-title-contact" class="flex items-center min-w-full border-top">
					<img
						id="section-arrow-menu"
						src="/icons/arrow.svg"
						alt=""
						class="section-arrow mx-3 open"
					/>
					<p class="font-fira_regular text-white text-sm">{{ t('contacts.direct.title') }}</p>
				</div>
				<div id="contact-sources" class="hidden lg:flex lg:flex-col my-2">
					<div
						v-for="(source, key) in directContactSources"
						:key="key"
						class="flex items-center mb-2"
					>
						<img :src="`/icons/${key}.svg`" alt="" />
						<a
							v-html="source"
							href="/"
							class="font-fira_retina text-menu-text hover:text-white"
						></a>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale, messages } = useI18n()
const loading = ref(false)
const currentSection = ref('personal-info')
const currentFolder = ref('bio')

// Accéder à l'ensemble des sections depuis le message de traduction
const aboutSections = computed(() => {
	return messages[locale.value].about.sections
})
const currentSectionInfo = computed(() => {
	const section = aboutSections.value[currentSection.value]
	return section ? section.info : {}
})
const currentSectionTitle = computed(() => {
	const section = aboutSections.value[currentSection.value]
	return section ? section.title : ''
})
const directContactSources = computed(() => {
	return messages[locale.value].contacts.direct.sources
})

const isSectionActive = (title) => currentSection.value === title
const folderIsActive = (title) => currentFolder.value === title

const focusCurrentSection = (section) => {
	currentSection.value = section.title
	const keys = Object.keys(section.info)
	if (keys.length > 0) {
		currentFolder.value = keys[0]
	}
}
const focusCurrentFolder = (folder) => {
	currentFolder.value = folder.title
}
</script>
<style>
#sections {
	width: 5rem; /* 80px */
	height: 100%;
	display: none;
	border-right: 1px solid #1e2d3d;
}

/* LG */
@media (min-width: 1024px) {
	#sections {
		display: block;
	}
}

#section-icon {
	@apply my-6 hover:cursor-pointer flex justify-center;
	opacity: 0.4;
}

#section-icon.active {
	opacity: 1;
}

#section-icon:hover {
	opacity: 1;
}

.tab-height {
	min-height: 35px;
	max-height: 35px;
}

#tab-mobile {
	padding: 25px 20px 0px 25px;
	align-items: flex-end;
}

#scroll-bar {
	width: 20px;
}

#scroll {
	width: 14px;
	height: 7px;
	background-color: #607b96;
}

#diple {
	@apply mx-3 w-2 max-w-fit;
}

.open {
	transform: rotate(90deg);
}

.active {
	color: white;
}

#right,
#left {
	height: 100%;
	overflow: hidden;
}

#gists-content {
	height: 100%;
	overflow: hidden;
}

@media (max-width: 1024px) {
	#gists-content {
		height: 100%;
		padding: 0px 25px;
		overflow: hidden;
	}

	#about {
		min-height: stretch;
	}
}

.section-arrow {
	transition: 0.1s;
}

#section-content #contacts {
	padding: 0px 25px;
}
</style>
