# Terms
- Article list
- Scan field
- Escape
- resets
- focused
---

# Requirements
---

# 1. Keys
  ## Escape
  ```feature
    When I press the Escape button
    Then the Scan Field resets
    Then the Scan Field gets focused
    Then the Article List resets
  ```


# 2. Header
  ## Status
  ## Help

# 3. Search Price
- .
  ## 2.1 Scan product bar code
    - Scan field - product exists - read
      ```feature
        Given the product exists
        When a price is input into the Scan Field
        Then the name appears
        Then the prices appears
        Then the product appears in the Article List
      ```

    - Scan field - product exists - edit
      ```feature
        Given the product exists
        When a price is input into the Scan Field
        Then the name can be changed
        Then the prices can be changed
      ```


    - Scan field - product does not exists
      ```feature
        Given the product does not exists
        When a price is input into the Scan Field
        Then a warning should appear
        Then new product can be added
      ```

  ## 2.2 Price
  ```feature

  ```
  ## 2.3 Name
  ## 2.4 CRUD
    ### 2.4.1 Create
    ### 2.4.2 Edit
    ### 2.4.3 Delete

# 4. Summary
- .
  ## Article List
    ### Amount
  ## Total sum

# x. New
  ## History
  ## List all products
