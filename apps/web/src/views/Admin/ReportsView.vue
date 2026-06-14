<template>
  <div class="px-3 md:p-0">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-mainBlack">Reports</h1>
        <p v-if="term" class="text-sm text-darkGray">
          {{ term.name }} ·
          {{ new Date(term.starts_at).toLocaleDateString() }} –
          {{ new Date(term.ends_at).toLocaleDateString() }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <select
          v-model="selectedDepartment"
          @change="load"
          class="bg-offWhite border border-lightPurple text-mainBlack px-4 py-2 rounded-md cursor-pointer focus:outline-none focus:ring-0"
        >
          <option value="">All departments</option>
          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
        <button
          @click="download"
          :disabled="downloading"
          class="bg-mainPurple hover:bg-darkPurple text-white px-4 py-2 rounded-md transition disabled:opacity-50"
        >
          {{ downloading ? 'Exporting…' : 'Export CSV' }}
        </button>
      </div>
    </div>

    <!-- Totals -->
    <div v-if="totals" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-offWhite border border-lightPurple rounded-md p-4">
        <p class="text-sm text-darkGray">Courses</p>
        <p class="text-2xl font-bold">{{ totals.courses }}</p>
      </div>
      <div class="bg-offWhite border border-lightPurple rounded-md p-4">
        <p class="text-sm text-darkGray">Enrolled</p>
        <p class="text-2xl font-bold">{{ totals.enrolled }}</p>
      </div>
      <div class="bg-brightGreen border border-darkGreen rounded-md p-4">
        <p class="text-sm text-mainOil">Completion</p>
        <p class="text-2xl font-bold">{{ totals.overall_completion_pct }}%</p>
      </div>
      <div class="bg-brightGreen border border-darkGreen rounded-md p-4">
        <p class="text-sm text-mainOil">Avg score</p>
        <p class="text-2xl font-bold">{{ totals.overall_avg_score ?? '—' }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-md border border-lightPurple bg-offWhite">
      <table class="w-full table-auto text-left text-sm">
        <thead>
          <tr class="bg-white border-b border-lightPurple text-mainBlack">
            <th class="p-4 cursor-pointer" @click="sortBy('name')">Course</th>
            <th class="p-4 cursor-pointer" @click="sortBy('course_code')">Code</th>
            <th class="p-4 hidden md:table-cell">Department</th>
            <th class="p-4 text-center cursor-pointer" @click="sortBy('enrolled_count')">Enrolled</th>
            <th class="p-4 text-center cursor-pointer" @click="sortBy('evaluated_count')">Evaluated</th>
            <th class="p-4 text-center cursor-pointer" @click="sortBy('completion')">Completion</th>
            <th class="p-4 text-center cursor-pointer" @click="sortBy('avg_score')">Avg</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in sortedRows"
            :key="row.course_id"
            class="border-b border-lightPurple last:border-b-0 bg-white bg-opacity-50"
          >
            <td class="p-4 font-medium">{{ row.name }}</td>
            <td class="p-4">{{ row.course_code }}</td>
            <td class="p-4 hidden md:table-cell">{{ row.department_name }}</td>
            <td class="p-4 text-center">{{ row.enrolled_count }}</td>
            <td class="p-4 text-center">{{ row.evaluated_count }}</td>
            <td class="p-4 text-center">{{ completion(row) }}%</td>
            <td class="p-4 text-center">{{ row.avg_score ?? '—' }}</td>
          </tr>
          <tr v-if="!loading && rows.length === 0">
            <td colspan="7" class="p-8 text-center text-darkGray">No data for this term.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { reportsApi } from '../../api/reports';
import { adminApi } from '../../api/admin';

const toast = useToast();
const rows = ref([]);
const totals = ref(null);
const term = ref(null);
const departments = ref([]);
const selectedDepartment = ref('');
const loading = ref(false);
const downloading = ref(false);

const sortKey = ref('course_code');
const sortAsc = ref(true);

const completion = (row) =>
  row.enrolled_count ? Math.round((row.evaluated_count / row.enrolled_count) * 1000) / 10 : 0;

const sortedRows = computed(() => {
  const copy = [...rows.value];
  copy.sort((a, b) => {
    const k = sortKey.value;
    const av = k === 'completion' ? completion(a) : a[k];
    const bv = k === 'completion' ? completion(b) : b[k];
    if (av === bv) return 0;
    const dir = sortAsc.value ? 1 : -1;
    return (av > bv ? 1 : -1) * dir;
  });
  return copy;
});

function sortBy(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value;
  else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

async function load() {
  loading.value = true;
  try {
    const summary = await reportsApi.summary(selectedDepartment.value || undefined);
    rows.value = summary.rows;
    totals.value = summary.totals;
    term.value = summary.term;
  } catch (error) {
    toast.error('Failed to load report');
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function download() {
  downloading.value = true;
  try {
    const blob = await reportsApi.exportFile('csv', selectedDepartment.value || undefined);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `e-val-report-${term.value?.name?.replace(/\s+/g, '-').toLowerCase() ?? 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    toast.error('Export failed');
    console.error(error);
  } finally {
    downloading.value = false;
  }
}

onMounted(async () => {
  try {
    departments.value = await adminApi.departments();
  } catch (error) {
    console.error(error);
  }
  load();
});
</script>
