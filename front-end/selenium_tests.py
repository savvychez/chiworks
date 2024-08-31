# install selenium version 4.14.0 through pip
# install webdriver-manager version 4.0.1 through pip
# install chrome on linux using sudo apt

import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver import ChromeOptions
from webdriver_manager.chrome import ChromeDriverManager

class chiworksTest(unittest.TestCase):
    
    def setUp(self) -> None:
        options = ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--no-sandbox")
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()),
                                       options=options)
        self.driver.get("https://www.chiworks.me/")
        self.driver.maximize_window()
        self.driver.implicitly_wait(5)


    def test_open_landing(self) -> None:
        driver = self.driver
        self.assertIn("ChiWorks", driver.title)

    def test_main_heading(self) -> None:
        driver = self.driver
        main_heading = driver.find_element(By.XPATH, "//h1[text()='chiworks']")
        self.assertIsNotNone(main_heading)

    def test_sub_heading(self) -> None:
        driver = self.driver
        sub_heading = driver.find_element(By.XPATH, "//p[contains(text(), 'your guide to working in the') and contains(., 'windy city')]")
        self.assertIsNotNone(sub_heading)

    def test_open_jobs(self) -> None:
        driver = self.driver
        driver.find_element(By.LINK_TEXT, "jobs").click()

    def test_open_employers(self) -> None:
        driver = self.driver
        driver.find_element(By.LINK_TEXT, "employers").click()

    def test_open_resources(self) -> None:
        driver = self.driver
        driver.find_element(By.LINK_TEXT, "resources").click()

    def test_open_about(self) -> None:
        driver = self.driver
        driver.find_element(By.LINK_TEXT, "about").click()

    def test_open_api(self) -> None:
        driver = self.driver
        driver.find_element(By.LINK_TEXT, "api").click()

    def test_about_page_content(self) -> None:
        driver = self.driver
        driver.find_element(By.LINK_TEXT, "about").click()
        main_content = "Chiworks is a platform designed to address the deep-rooted unemployment challenges faced by the predominantly African-American community in Southside Chicago."
        self.assertIn(main_content, driver.page_source)

    def test_team_member_details(self) -> None:
        driver = self.driver
        driver.find_element(By.LINK_TEXT, "about").click()
        team_member_name = "Akram"
        team_member_role = "Front-end, GitLab API"
        team_member_description = "Hi, I'm Akram. I'm a senior, and I'm excited to be working on this full-stack development project with the rest of the team!"
        self.assertIn(team_member_name, driver.page_source)
        self.assertIn(team_member_role, driver.page_source)
        self.assertIn(team_member_description, driver.page_source)

    def tearDown(self) -> None:
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
