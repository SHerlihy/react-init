{
    match($0, /src="([^"]+)"/, arr);
    if (arr[1] != "") {
        gsub(/src="([^"]+)"/, "src=\"/" LAMBDA_NAME arr[1] "\"");
    }

    match($0, /href="([^"]+)"/, arr);
    if (arr[1] != "") {
        gsub(/href="([^"]+)"/, "href=\"/" LAMBDA_NAME arr[1] "\"");
    }

    print $0;
}
