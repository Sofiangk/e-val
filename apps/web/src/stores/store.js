import { reactive } from 'vue';
import { courses, students, sections } from '../../data';

const store = reactive({
  courses,
  sections,
  students,
  courseName: 'No Course Selected',
  instructorName: 'No Course Selected',
  selectedCourseId: '',
  showNotification: true,

  selectCourse(courseId) {
    this.selectedCourseId = courseId;
    this.updateCourseInfo();
  },

  updateCourseInfo() {
    const selectedCourse = this.courses.find(
      (course) => course.id === this.selectedCourseId
    );
    if (selectedCourse) {
      this.courseName = selectedCourse.name;
      this.instructorName = selectedCourse.instructor;
      this.showNotification = false;
    } else {
      this.courseName = 'No Course Selected';
      this.instructorName = 'No Course Selected';
      this.showNotification = true;
    }
  },

  resetForm() {
    this.selectedCourseId = '';
    this.updateCourseInfo();
    this.sections.forEach((section) => {
      section.questions.forEach((question) => {
        question.selectedOption = '';
      });
    });
  },
});

export default store;
