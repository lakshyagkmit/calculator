db.accounts.aggregate([
	{
		$project: {
			_id: 1,
			roles: {
				$objectToArray: "$roles",
			},
		},
	},
	{
		$unwind: "$roles"
	},
	{
		$group: {
			_id: "$roles.k",
			count: { $count: {}}
		}
	}
])